const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return <div className={notification.type}>{notification.message}</div>
}

export default Notification
