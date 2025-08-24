

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Anime Recommendation App</h1>
      <a href="/questions" >
        <button className='hover:cursor-pointer hover:bg-white hover:text-black p-4 m-2 transition ease-in-out' style={{ fontSize: '20px', padding: '10px 20px' }}>
          Start Questionnaire
        </button>
      </a>
    </div>
  );
};

export default LandingPage;
