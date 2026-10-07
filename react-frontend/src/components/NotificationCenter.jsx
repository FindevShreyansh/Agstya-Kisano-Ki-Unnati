const notificationStyles = {
  success: {
    icon: "✅",
    border: "border-l-green-500",
    iconBackground: "bg-green-100",
  },
  info: {
    icon: "ℹ️",
    border: "border-l-blue-500",
    iconBackground: "bg-blue-100",
  },
  update: {
    icon: "🔔",
    border: "border-l-amber-500",
    iconBackground: "bg-amber-100",
  },
  warning: {
    icon: "⚠️",
    border: "border-l-red-500",
    iconBackground: "bg-red-100",
  },
};

function formatNotificationDate(date) {
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString();
}

function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  return (
    <section className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">
          Notifications <span aria-label={`${unreadCount} unread`}>🔔 {unreadCount}</span>
        </h2>
        <button
          type="button"
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
          className="text-sm font-semibold text-green-700 hover:text-green-900 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Mark All as Read
        </button>
      </header>

      {notifications.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <span className="text-4xl" aria-hidden="true">🔕</span>
          <p className="mt-3 font-semibold text-gray-700">No new notifications</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {notifications.map((notification) => {
            const style =
              notificationStyles[notification.type] || notificationStyles.info;

            return (
              <li
                key={notification.id}
                className={`border-l-4 ${style.border} p-4 sm:p-5 transition-colors ${
                  notification.read ? "bg-white" : "bg-green-50/70"
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${style.iconBackground}`}
                    aria-hidden="true"
                  >
                    {style.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-sm sm:text-base ${
                          notification.read
                            ? "font-semibold text-gray-700"
                            : "font-bold text-gray-900"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="rounded-full bg-green-700 px-2 py-0.5 text-xs font-semibold text-white">
                          Unread
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 break-words">
                      {notification.message}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                      <time
                        dateTime={notification.date}
                        className="text-xs text-gray-500"
                      >
                        {formatNotificationDate(notification.date)}
                      </time>
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(notification.id)}
                          className="text-xs font-semibold text-green-700 hover:text-green-900"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default NotificationCenter;
