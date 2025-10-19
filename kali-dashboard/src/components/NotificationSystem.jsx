import React from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'

const NotificationSystem = ({ notifications, onRemove, darkMode }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return darkMode 
          ? 'bg-green-900/20 border-green-500/30 text-green-300' 
          : 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return darkMode 
          ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300' 
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error':
        return darkMode 
          ? 'bg-red-900/20 border-red-500/30 text-red-300' 
          : 'bg-red-50 border-red-200 text-red-800'
      default:
        return darkMode 
          ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' 
          : 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-xl border backdrop-blur-sm shadow-lg transform transition-all duration-300 animate-slide-in ${getColors(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-sm opacity-90 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => onRemove(notification.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem
