#!/usr/bin/env python3
"""
Output Validator Module
Detects hallucinations, errors, and missing data in agent outputs
"""

import json
import re
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from enum import Enum

class ValidationSeverity(Enum):
    INFO = "info"
    WARNING = "warning" 
    ERROR = "error"
    CRITICAL = "critical"

@dataclass
class ValidationResult:
    rule_name: str
    severity: ValidationSeverity
    message: str
    field_path: str
    expected_value: Any = None
    actual_value: Any = None
    suggestion: str = ""

@dataclass
class ValidationReport:
    agent_name: str
    task_id: str
    total_checks: int
    passed_checks: int
    failed_checks: int
    warnings: int
    errors: int
    critical_issues: int
    validation_results: List[ValidationResult]
    overall_score: float
    is_valid: bool
    timestamp: datetime

class OutputValidator:
    """
    Validates agent outputs for completeness, accuracy, and data integrity
    """
    
    def __init__(self):
        self.setup_logging()
        self.validation_rules = self._load_validation_rules()
        self.data_patterns = self._load_data_patterns()
        
    def setup_logging(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger('OutputValidator')
        
    def _load_validation_rules(self) -> Dict[str, Dict[str, Any]]:
        """Load validation rules for each agent type"""
        return {
            "VoiceResponder": {
                "required_fields": [
                    "urgency_level", "damage_type", "customer_info", 
                    "summary", "next_action", "timestamp"
                ],
                "field_types": {
                    "urgency_level": str,
                    "damage_type": str,
                    "customer_info": dict,
                    "summary": str,
                    "next_action": str,
                    "location": str
                },
                "valid_values": {
                    "urgency_level": ["emergency", "high", "medium", "low"],
                    "damage_type": [
                        "roof_leak", "roof_damage", "window_damage", 
                        "siding_damage", "flooding", "structural", "electrical", "general"
                    ]
                },
                "field_constraints": {
                    "summary": {"min_length": 10, "max_length": 500},
                    "customer_info": {"required_subfields": ["name", "phone"]},
                    "urgency_level": {"not_empty": True},
                    "damage_type": {"not_empty": True}
                }
            },
            "QuoteDraft": {
                "required_fields": [
                    "quote_id", "materials", "labor", "subtotal", 
                    "tax_amount", "total", "timeline", "terms"
                ],
                "field_types": {
                    "quote_id": str,
                    "materials": list,
                    "labor": list,
                    "subtotal": (int, float),
                    "tax_amount": (int, float),
                    "total": (int, float),
                    "timeline": str,
                    "terms": list
                },
                "field_constraints": {
                    "quote_id": {"pattern": r"^Q-[A-Z0-9]{8}$"},
                    "subtotal": {"min_value": 0},
                    "tax_amount": {"min_value": 0},
                    "total": {"min_value": 0},
                    "materials": {"min_items": 1},
                    "labor": {"min_items": 1},
                    "timeline": {"min_length": 5}
                },
                "business_rules": {
                    "total_calculation": "subtotal + tax_amount should equal total",
                    "reasonable_pricing": "total should be between $100 and $50000",
                    "material_labor_ratio": "materials should be 40-70% of subtotal"
                }
            },
            "MaterialOrderBot": {
                "required_fields": [
                    "order_id", "quote_id", "items", "suppliers", 
                    "total_cost", "delivery_date", "status"
                ],
                "field_types": {
                    "order_id": str,
                    "quote_id": str,
                    "items": list,
                    "suppliers": list,
                    "total_cost": (int, float),
                    "delivery_date": str,
                    "status": str
                },
                "valid_values": {
                    "status": ["pending", "confirmed", "shipped", "delivered", "cancelled"]
                },
                "field_constraints": {
                    "order_id": {"pattern": r"^ORD-[A-Z0-9]{8}$"},
                    "quote_id": {"pattern": r"^Q-[A-Z0-9]{8}$"},
                    "items": {"min_items": 1},
                    "suppliers": {"min_items": 1},
                    "total_cost": {"min_value": 0},
                    "delivery_date": {"date_format": True}
                },
                "business_rules": {
                    "delivery_future": "delivery_date should be in the future",
                    "reasonable_cost": "total_cost should be between $50 and $25000"
                }
            }
        }
        
    def _load_data_patterns(self) -> Dict[str, str]:
        """Load regex patterns for data validation"""
        return {
            "phone_number": r"^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$",
            "email": r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
            "quote_id": r"^Q-[A-Z0-9]{8}$",
            "order_id": r"^ORD-[A-Z0-9]{8}$",
            "date_iso": r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}",
            "currency": r"^\$?[\d,]+\.?\d{0,2}$"
        }
        
    def validate_output(self, agent_name: str, output_data: Dict[str, Any], 
                       task_id: str = "") -> ValidationReport:
        """
        Validate agent output against rules and detect issues
        """
        if agent_name not in self.validation_rules:
            raise ValueError(f"No validation rules found for agent: {agent_name}")
            
        rules = self.validation_rules[agent_name]
        validation_results = []
        
        # Run all validation checks
        validation_results.extend(self._check_required_fields(output_data, rules, agent_name))
        validation_results.extend(self._check_field_types(output_data, rules, agent_name))
        validation_results.extend(self._check_valid_values(output_data, rules, agent_name))
        validation_results.extend(self._check_field_constraints(output_data, rules, agent_name))
        validation_results.extend(self._check_business_rules(output_data, rules, agent_name))
        validation_results.extend(self._check_data_patterns(output_data, agent_name))
        validation_results.extend(self._check_hallucinations(output_data, agent_name))
        
        # Calculate metrics
        total_checks = len(validation_results)
        failed_checks = sum(1 for r in validation_results if r.severity in [ValidationSeverity.ERROR, ValidationSeverity.CRITICAL])
        warnings = sum(1 for r in validation_results if r.severity == ValidationSeverity.WARNING)
        errors = sum(1 for r in validation_results if r.severity == ValidationSeverity.ERROR)
        critical_issues = sum(1 for r in validation_results if r.severity == ValidationSeverity.CRITICAL)
        passed_checks = total_checks - failed_checks - warnings
        
        # Calculate overall score
        if total_checks == 0:
            overall_score = 100.0
        else:
            score = ((passed_checks + (warnings * 0.5)) / total_checks) * 100
            overall_score = max(0.0, score)
        
        # Determine if output is valid
        is_valid = critical_issues == 0 and errors == 0
        
        report = ValidationReport(
            agent_name=agent_name,
            task_id=task_id,
            total_checks=total_checks,
            passed_checks=passed_checks,
            failed_checks=failed_checks,
            warnings=warnings,
            errors=errors,
            critical_issues=critical_issues,
            validation_results=validation_results,
            overall_score=overall_score,
            is_valid=is_valid,
            timestamp=datetime.now()
        )
        
        self.logger.info(f"Validation completed for {agent_name}: Score {overall_score:.1f}%, Valid: {is_valid}")
        return report
        
    def _check_required_fields(self, data: Dict[str, Any], rules: Dict[str, Any], 
                             agent_name: str) -> List[ValidationResult]:
        """Check for required fields"""
        results = []
        required_fields = rules.get("required_fields", [])
        
        for field in required_fields:
            if field not in data:
                results.append(ValidationResult(
                    rule_name="required_field",
                    severity=ValidationSeverity.CRITICAL,
                    message=f"Required field '{field}' is missing",
                    field_path=field,
                    expected_value="Present",
                    actual_value="Missing",
                    suggestion=f"Ensure {agent_name} includes {field} in output"
                ))
            elif data[field] is None:
                results.append(ValidationResult(
                    rule_name="null_value",
                    severity=ValidationSeverity.ERROR,
                    message=f"Required field '{field}' is null",
                    field_path=field,
                    expected_value="Non-null value",
                    actual_value="null",
                    suggestion=f"Provide a valid value for {field}"
                ))
                
        return results
        
    def _check_field_types(self, data: Dict[str, Any], rules: Dict[str, Any], 
                          agent_name: str) -> List[ValidationResult]:
        """Check field data types"""
        results = []
        field_types = rules.get("field_types", {})
        
        for field, expected_type in field_types.items():
            if field in data and data[field] is not None:
                if not isinstance(data[field], expected_type):
                    results.append(ValidationResult(
                        rule_name="type_mismatch",
                        severity=ValidationSeverity.ERROR,
                        message=f"Field '{field}' has incorrect type",
                        field_path=field,
                        expected_value=str(expected_type),
                        actual_value=str(type(data[field])),
                        suggestion=f"Convert {field} to {expected_type.__name__}"
                    ))
                    
        return results
        
    def _check_valid_values(self, data: Dict[str, Any], rules: Dict[str, Any], 
                           agent_name: str) -> List[ValidationResult]:
        """Check for valid enumerated values"""
        results = []
        valid_values = rules.get("valid_values", {})
        
        for field, allowed_values in valid_values.items():
            if field in data and data[field] is not None:
                if data[field] not in allowed_values:
                    results.append(ValidationResult(
                        rule_name="invalid_value",
                        severity=ValidationSeverity.ERROR,
                        message=f"Field '{field}' has invalid value",
                        field_path=field,
                        expected_value=f"One of: {allowed_values}",
                        actual_value=data[field],
                        suggestion=f"Use one of the valid values: {', '.join(allowed_values)}"
                    ))
                    
        return results
        
    def _check_field_constraints(self, data: Dict[str, Any], rules: Dict[str, Any], 
                                agent_name: str) -> List[ValidationResult]:
        """Check field-specific constraints"""
        results = []
        constraints = rules.get("field_constraints", {})
        
        for field, field_constraints in constraints.items():
            if field not in data or data[field] is None:
                continue
                
            value = data[field]
            
            # Check string length constraints
            if "min_length" in field_constraints and isinstance(value, str):
                if len(value) < field_constraints["min_length"]:
                    results.append(ValidationResult(
                        rule_name="min_length",
                        severity=ValidationSeverity.WARNING,
                        message=f"Field '{field}' is too short",
                        field_path=field,
                        expected_value=f"At least {field_constraints['min_length']} characters",
                        actual_value=f"{len(value)} characters",
                        suggestion=f"Provide more detailed {field}"
                    ))
                    
            if "max_length" in field_constraints and isinstance(value, str):
                if len(value) > field_constraints["max_length"]:
                    results.append(ValidationResult(
                        rule_name="max_length",
                        severity=ValidationSeverity.WARNING,
                        message=f"Field '{field}' is too long",
                        field_path=field,
                        expected_value=f"At most {field_constraints['max_length']} characters",
                        actual_value=f"{len(value)} characters",
                        suggestion=f"Shorten {field} description"
                    ))
                    
            # Check numeric constraints
            if "min_value" in field_constraints and isinstance(value, (int, float)):
                if value < field_constraints["min_value"]:
                    results.append(ValidationResult(
                        rule_name="min_value",
                        severity=ValidationSeverity.ERROR,
                        message=f"Field '{field}' is below minimum value",
                        field_path=field,
                        expected_value=f">= {field_constraints['min_value']}",
                        actual_value=value,
                        suggestion=f"Ensure {field} is non-negative"
                    ))
                    
            # Check list constraints
            if "min_items" in field_constraints and isinstance(value, list):
                if len(value) < field_constraints["min_items"]:
                    results.append(ValidationResult(
                        rule_name="min_items",
                        severity=ValidationSeverity.ERROR,
                        message=f"Field '{field}' has too few items",
                        field_path=field,
                        expected_value=f"At least {field_constraints['min_items']} items",
                        actual_value=f"{len(value)} items",
                        suggestion=f"Include more items in {field}"
                    ))
                    
            # Check pattern constraints
            if "pattern" in field_constraints and isinstance(value, str):
                pattern = field_constraints["pattern"]
                if not re.match(pattern, value):
                    results.append(ValidationResult(
                        rule_name="pattern_mismatch",
                        severity=ValidationSeverity.ERROR,
                        message=f"Field '{field}' doesn't match expected pattern",
                        field_path=field,
                        expected_value=f"Pattern: {pattern}",
                        actual_value=value,
                        suggestion=f"Format {field} correctly"
                    ))
                    
            # Check required subfields
            if "required_subfields" in field_constraints and isinstance(value, dict):
                required_subfields = field_constraints["required_subfields"]
                for subfield in required_subfields:
                    if subfield not in value:
                        results.append(ValidationResult(
                            rule_name="missing_subfield",
                            severity=ValidationSeverity.ERROR,
                            message=f"Required subfield '{subfield}' missing in '{field}'",
                            field_path=f"{field}.{subfield}",
                            expected_value="Present",
                            actual_value="Missing",
                            suggestion=f"Include {subfield} in {field}"
                        ))
                        
        return results
        
    def _check_business_rules(self, data: Dict[str, Any], rules: Dict[str, Any], 
                            agent_name: str) -> List[ValidationResult]:
        """Check business logic rules"""
        results = []
        business_rules = rules.get("business_rules", {})
        
        for rule_name, rule_description in business_rules.items():
            if rule_name == "total_calculation" and agent_name == "QuoteDraft":
                if all(field in data for field in ["subtotal", "tax_amount", "total"]):
                    expected_total = data["subtotal"] + data["tax_amount"]
                    actual_total = data["total"]
                    if abs(expected_total - actual_total) > 0.01:  # Allow for small rounding differences
                        results.append(ValidationResult(
                            rule_name="total_calculation",
                            severity=ValidationSeverity.ERROR,
                            message="Total calculation is incorrect",
                            field_path="total",
                            expected_value=expected_total,
                            actual_value=actual_total,
                            suggestion="Recalculate total as subtotal + tax_amount"
                        ))
                        
            elif rule_name == "reasonable_pricing" and agent_name == "QuoteDraft":
                if "total" in data:
                    total = data["total"]
                    if total < 100 or total > 50000:
                        severity = ValidationSeverity.WARNING if 50 <= total <= 75000 else ValidationSeverity.ERROR
                        results.append(ValidationResult(
                            rule_name="reasonable_pricing",
                            severity=severity,
                            message="Total price seems unreasonable",
                            field_path="total",
                            expected_value="$100 - $50,000",
                            actual_value=f"${total}",
                            suggestion="Review pricing calculations for accuracy"
                        ))
                        
            elif rule_name == "delivery_future" and agent_name == "MaterialOrderBot":
                if "delivery_date" in data:
                    try:
                        delivery_date = datetime.fromisoformat(data["delivery_date"].replace('Z', '+00:00'))
                        if delivery_date <= datetime.now():
                            results.append(ValidationResult(
                                rule_name="delivery_future",
                                severity=ValidationSeverity.ERROR,
                                message="Delivery date is in the past",
                                field_path="delivery_date",
                                expected_value="Future date",
                                actual_value=data["delivery_date"],
                                suggestion="Set delivery date to future date"
                            ))
                    except ValueError:
                        pass  # Date format validation handled elsewhere
                        
        return results
        
    def _check_data_patterns(self, data: Dict[str, Any], agent_name: str) -> List[ValidationResult]:
        """Check data patterns like phone numbers, emails, etc."""
        results = []
        
        def check_nested_patterns(obj, path=""):
            if isinstance(obj, dict):
                for key, value in obj.items():
                    current_path = f"{path}.{key}" if path else key
                    check_nested_patterns(value, current_path)
            elif isinstance(obj, list):
                for i, item in enumerate(obj):
                    current_path = f"{path}[{i}]"
                    check_nested_patterns(item, current_path)
            elif isinstance(obj, str):
                # Check phone number pattern
                if any(keyword in path.lower() for keyword in ["phone", "mobile", "contact"]):
                    if not re.match(self.data_patterns["phone_number"], obj):
                        results.append(ValidationResult(
                            rule_name="phone_format",
                            severity=ValidationSeverity.WARNING,
                            message=f"Phone number format may be invalid: {path}",
                            field_path=path,
                            expected_value="Valid phone format",
                            actual_value=obj,
                            suggestion="Ensure phone number is properly formatted"
                        ))
                        
                # Check email pattern
                if "email" in path.lower():
                    if not re.match(self.data_patterns["email"], obj):
                        results.append(ValidationResult(
                            rule_name="email_format",
                            severity=ValidationSeverity.WARNING,
                            message=f"Email format may be invalid: {path}",
                            field_path=path,
                            expected_value="Valid email format",
                            actual_value=obj,
                            suggestion="Ensure email address is properly formatted"
                        ))
                        
        check_nested_patterns(data)
        return results
        
    def _check_hallucinations(self, data: Dict[str, Any], agent_name: str) -> List[ValidationResult]:
        """Check for potential hallucinations or unrealistic data"""
        results = []
        
        # Check for suspicious patterns that might indicate hallucinations
        def check_for_hallucinations(obj, path=""):
            if isinstance(obj, dict):
                for key, value in obj.items():
                    current_path = f"{path}.{key}" if path else key
                    check_for_hallucinations(value, current_path)
            elif isinstance(obj, str):
                # Check for placeholder text
                placeholder_patterns = [
                    r"\[.*?\]", r"TODO", r"PLACEHOLDER", r"XXX", r"TBD",
                    r"lorem ipsum", r"example\.com", r"test@test",
                    r"123-456-7890", r"555-0123"
                ]
                
                for pattern in placeholder_patterns:
                    if re.search(pattern, obj, re.IGNORECASE):
                        results.append(ValidationResult(
                            rule_name="placeholder_text",
                            severity=ValidationSeverity.WARNING,
                            message=f"Potential placeholder text detected in {path}",
                            field_path=path,
                            expected_value="Real data",
                            actual_value=obj,
                            suggestion="Replace placeholder with actual data"
                        ))
                        
                # Check for unrealistic values
                if agent_name == "QuoteDraft":
                    # Look for suspiciously round numbers
                    if path.endswith("cost") or path.endswith("total"):
                        try:
                            value = float(obj.replace("$", "").replace(",", ""))
                            if value > 1000 and value % 100 == 0:
                                results.append(ValidationResult(
                                    rule_name="round_number_suspicious",
                                    severity=ValidationSeverity.INFO,
                                    message=f"Suspiciously round number in {path}",
                                    field_path=path,
                                    expected_value="Precise calculation",
                                    actual_value=obj,
                                    suggestion="Verify calculation accuracy"
                                ))
                        except ValueError:
                            pass
                            
        check_for_hallucinations(data)
        return results
        
    def generate_feedback(self, report: ValidationReport) -> Dict[str, Any]:
        """Generate actionable feedback for fixing validation issues"""
        feedback = {
            "summary": {
                "agent": report.agent_name,
                "score": report.overall_score,
                "is_valid": report.is_valid,
                "critical_issues": report.critical_issues,
                "errors": report.errors,
                "warnings": report.warnings
            },
            "critical_fixes": [],
            "error_fixes": [],
            "improvements": [],
            "recommendations": []
        }
        
        for result in report.validation_results:
            fix_item = {
                "field": result.field_path,
                "issue": result.message,
                "suggestion": result.suggestion,
                "expected": result.expected_value,
                "actual": result.actual_value
            }
            
            if result.severity == ValidationSeverity.CRITICAL:
                feedback["critical_fixes"].append(fix_item)
            elif result.severity == ValidationSeverity.ERROR:
                feedback["error_fixes"].append(fix_item)
            elif result.severity == ValidationSeverity.WARNING:
                feedback["improvements"].append(fix_item)
            else:
                feedback["recommendations"].append(fix_item)
                
        return feedback
        
    def format_report(self, report: ValidationReport) -> str:
        """Format validation report for display"""
        lines = [
            f"=== Validation Report for {report.agent_name} ===",
            f"Task ID: {report.task_id}",
            f"Timestamp: {report.timestamp.isoformat()}",
            f"Overall Score: {report.overall_score:.1f}%",
            f"Status: {'VALID' if report.is_valid else 'INVALID'}",
            "",
            f"Total Checks: {report.total_checks}",
            f"Passed: {report.passed_checks}",
            f"Warnings: {report.warnings}",
            f"Errors: {report.errors}",
            f"Critical: {report.critical_issues}",
            ""
        ]
        
        if report.validation_results:
            lines.append("Issues Found:")
            for result in report.validation_results:
                severity_symbol = {
                    ValidationSeverity.INFO: "ℹ",
                    ValidationSeverity.WARNING: "⚠",
                    ValidationSeverity.ERROR: "❌",
                    ValidationSeverity.CRITICAL: "🚨"
                }
                symbol = severity_symbol.get(result.severity, "•")
                lines.append(f"  {symbol} {result.field_path}: {result.message}")
                if result.suggestion:
                    lines.append(f"    → {result.suggestion}")
        else:
            lines.append("No issues found.")
            
        return "\n".join(lines)

def test_output_validator():
    """Test the OutputValidator functionality"""
    validator = OutputValidator()
    
    print("--- Testing Output Validator ---")
    
    # Test VoiceResponder output (valid)
    voice_output_valid = {
        "urgency_level": "high",
        "damage_type": "roof_leak",
        "customer_info": {
            "name": "John Smith",
            "phone": "+1-234-567-8900"
        },
        "summary": "Customer reports active roof leak in kitchen area after storm",
        "next_action": "Schedule same-day inspection and temporary repairs",
        "location": "123 Main St",
        "timestamp": datetime.now().isoformat()
    }
    
    print("\n--- Valid VoiceResponder Output ---")
    report = validator.validate_output("VoiceResponder", voice_output_valid, "TEST-001")
    print(validator.format_report(report))
    
    # Test VoiceResponder output (invalid)
    voice_output_invalid = {
        "urgency_level": "super_urgent",  # Invalid value
        "damage_type": "",  # Empty
        "customer_info": {
            "name": "John Smith"
            # Missing phone
        },
        "summary": "Bad",  # Too short
        # Missing next_action and other required fields
    }
    
    print("\n--- Invalid VoiceResponder Output ---")
    report = validator.validate_output("VoiceResponder", voice_output_invalid, "TEST-002")
    print(validator.format_report(report))
    
    # Test QuoteDraft output
    quote_output = {
        "quote_id": "Q-12345678",
        "materials": [{"name": "Shingles", "cost": 2500}],
        "labor": [{"task": "Installation", "cost": 1800}],
        "subtotal": 4300,
        "tax_amount": 344,
        "total": 4644,  # Correct calculation
        "timeline": "3-5 business days",
        "terms": ["50% deposit required"]
    }
    
    print("\n--- QuoteDraft Output ---")
    report = validator.validate_output("QuoteDraft", quote_output, "TEST-003")
    print(validator.format_report(report))
    
    # Generate feedback
    feedback = validator.generate_feedback(report)
    print(f"\nFeedback: {json.dumps(feedback, indent=2)}")

if __name__ == "__main__":
    test_output_validator()