
function Progress({id}) {
  

  return (
    <header className="progress">
      <progress  />

      <p>
        {`${id}/15`}
      </p>

      <p>
        <strong>3</strong>
      </p>
    </header>
  );
}

export default Progress;