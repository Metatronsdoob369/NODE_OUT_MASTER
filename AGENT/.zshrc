# === Powerlevel10k Setup ===
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

source /usr/local/share/powerlevel10k/powerlevel10k.zsh-theme
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

export PROMPT='%n@%~$ '
export ELEVENLABS_API_KEY='your-api-key-here'

# === AGENT Shortcuts ===
alias agentcore='cd ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend'
alias agentrun='cd ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend && ./run.sh'
alias agentdev='cd ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend/frontend && npm run dev & cd ../backend && uvicorn main:app --reload --port 5002'
alias agentnuke='rm -rf ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend/frontend/dist ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend/__pycache__ && echo Cleaned.'
alias killport5002='lsof -ti:5002 | xargs kill -9'

# === Other Project Paths ===
alias cdkit='cd ~/NODE_OUT_Master/CODE/NewNODE_OUT/one0-base-kit'






# === AGENT Shortcuts ===
alias agentcore='cd ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend'
alias agentrun='cd ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend && ./run.sh'
alias agentdev='cd ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend/frontend && npm run dev & cd ../backend && uvicorn main:app --reload --port 5002'
alias agentnuke='rm -rf ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend/frontend/dist ~/NODE_OUT_Master/AGENT/local_ai_agent_frontend_backend/__pycache__ && echo Cleaned.'
alias killport5002='lsof -ti:5002 | xargs kill -9'























