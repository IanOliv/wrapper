function Item() {
  return (
    <div className="SelectionDefault" style={{ width: 200, height: '100%', position: 'relative' }}>
      <div
        className="Rectangle1"
        style={{
          width: 200,
          height: '100%',
          left: 0,
          top: 0,
          position: 'absolute',
          background: '#D9D9D9',
          borderRadius: 17,
        }}
      ></div>
    </div>
  );
}

export default Item;
