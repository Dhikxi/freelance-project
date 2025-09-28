import { useEffect } from 'react';
import { Link } from "react-router-dom";
import './Footer.scss';

const Footer = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='footer'>
      <div className="container">
        <div className="top">

          
        </div>

        <hr />

        <div className="bottom">
          <div className="left">
            <h2>workhive</h2>
          </div>

          <div className="right">
            <div className="social">
              
            </div>

            <div className="link">
              <img src="./media/language.png" alt="" />
              <span>English</span>
            </div>

            <div className="link">
              <img src="./media/coin.png" alt="" />
              <span>INR</span>
            </div>

            <div className="link">
              <img src="./media/accessibility.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
