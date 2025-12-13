import { Link } from "react-router";

export default function About() {
  return (
    <div id="about">
      <Link to="/">← Go to demo</Link>
      <h1>About This Webpage</h1>

      <div>
        <p>
          This is a website with specific instructions for enabling English
          language on Xfinity remote controls.
        </p>

        {/* <h2>Features</h2>
        <p>Explore the demo to see how React Router handles:</p>
        <ul>
          <li>Data loading and mutations with loaders and actions</li>
          <li>Nested routing with parent/child relationships</li>
          <li>URL-based routing with dynamic segments</li>
          <li>Pending and optimistic UI</li>
        </ul> */}

        <h2>Learn More</h2>
        <p>
          Check out KQED's website <a href="https://kqed.org">kqed.org</a> to
          learn more about KQED.
        </p>
      </div>
    </div>
  );
}
