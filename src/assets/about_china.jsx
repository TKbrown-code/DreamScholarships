
import image1 from './images/china-photo.jpg';
import image2 from './images/bbc.jpg';

export default function About_china() {
    return(
       <>
        <section>
            <div className="about-china-header">
                <h1>About China</h1>
                <p>Discover the Land of Opportunities</p>
                <div className="line"></div>
            </div>
            <div className="about-china-body">
            <div className="about-china-image">
                <img src={image1}  alt="About China" />
            </div>
            <div className="about-china">
                <h2>Why Study in China?</h2>
                <p>China is not just a country; it’s a gateway to the future. With its rich history, vibrant culture, and rapid technological advancements, studying in China offers African students unparalleled opportunities. From world-class universities to a diverse international community, China is the perfect place to broaden your horizons and build a global network.</p>
                <p>Experience cutting-edge research, innovative teaching methods, and a unique cultural immersion that will shape your academic and personal growth. Whether you’re interested in engineering, business, arts, or sciences, China has something for everyone.</p>
            </div>
            </div>
        </section>
       </>
    );
}