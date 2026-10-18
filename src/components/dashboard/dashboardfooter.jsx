 export default function Footer() {
    return(
        <>
        <div className="footer-content">
        <div className="links">
          <p>
            Contact us:{" "}
            <a href="mailto:DreamScholarship@gmail.com">
              DreamScholarship@gmail.com
            </a>
          </p>
          <p>
            Follow us on{" "}
            <a
              href="https://www.facebook.com/DreamScholarship"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>{" "}
            and{" "}
            <a
              href="https://www.twitter.com/DreamScholarship"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </p>
        </div>

        <div className="footer-links">
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-of-service">Terms of Service</a>
        </div>

        <div className="footerend">
          <p>&copy; {new Date().getFullYear()} Dream Scholarship. All rights reserved.</p>
          <p>Created EX-TECH</p>
        </div>
      </div>
        </>
    )
 }