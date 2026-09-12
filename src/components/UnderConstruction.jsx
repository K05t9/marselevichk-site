export default function UnderConstruction({ what = 'эта страница' }) {
  return (
    <div className="construction">
      <div className="construction-inner">
        🚧 {what} — В РАЗРАБОТКЕ 🚧
        <br />
        <span style={{ fontSize: 11 }}>зайдите через неделю (написано в 2004)</span>
      </div>
    </div>
  )
}
