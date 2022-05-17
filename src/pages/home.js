
const Home = () => {
    return (
        <div className="other-test"
            onMouseOver={(e) => e.target.play()}
        onMouseOut={(e) => e.target.pause()}>
           <h3>
               hello
           </h3>
            <video controls={true} src="https://s3.amazonaws.com/codecademy-content/courses/React/react_video-fast.mp4"
            >

            </video>
        </div>
    )
}

export default Home