import { Link } from "react-router-dom";

import ifprLogo from "../../assets/img/ifpr-logo.png";

import { Container } from "./styles";

export function Sidebar() {
  return (
    <Container>
      <img src={ifprLogo} />
      <div>
        <Link to="/">Provas</Link>
        <Link to="/tags">Tags</Link>
        <Link to="questions">Questões</Link>
      </div>
      <div className="footer-text">
        © Copyright IFPR
        <h5>Bruno Gaspar | Eduardo Rezes</h5>
      </div>
    </Container>
  );
}
