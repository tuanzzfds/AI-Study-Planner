
const TopHeader = () => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const dateStr = now.toLocaleDateString([], {month: 'long', day: 'numeric', year: 'numeric'});

  return (
    <div className="top-header">
      <div>
        <div className="time-info">{timeStr}</div>
        <div className="date-info">{dateStr}</div>
      </div>
      <div className="profile-icon"></div>
    </div>
  );
};

export default TopHeader;
