import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-left">
          <h1>Member Login</h1>
          <p className="subtitle">Please fill in your basic info</p>

          <form className="login-form">
            <div className="pill-input">
              <span className="input-icon">👤</span>
              <input type="text" placeholder="Username or Email" />
            </div>

            <div className="pill-input">
              <span className="input-icon">🔒</span>
              <input type="password" placeholder="Password" />
            </div>

            <button type="submit" className="login-btn">
              LOGIN
            </button>

            <div className="form-links">
              <a href="#">Forgot Password?</a>
            </div>
          </form>
        </div>

        <div className="auth-right">
          <div className="overlay">
            <h2>Sign Up</h2>
            <p>Using your social media account</p>

            <div className="social-row">
              <button className="social-btn">G</button>
              <button className="social-btn">f</button>
              <button className="social-btn">t</button>
            </div>

            <label className="terms">
              <input type="checkbox" />
              <span>
                By signing up I agree with <a href="#">terms and conditions</a>
              </span>
            </label>

            <a href="#" className="create-link">
              Create account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
