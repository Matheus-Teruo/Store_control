import Logo from "@/assets/image/LogoStoreControl.png";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div>
        <div>
          <img
            src={Logo}
            alt="Logo: imagem circular com um rosto de raposa no meio"
          />
          <h1>Store Control</h1>
        </div>
        <div>
          <Link to="/menu">
            <span>Cardápio</span>
          </Link>
          <div>
            <Link to="/auth/login">
              <span>Entrar</span>
            </Link>
            <p>ou</p>
            <Link to="/auth/signup">
              <span>Cadastrar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
