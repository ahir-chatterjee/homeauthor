import { Link } from "react-router-dom";

const GenerateButton = () => {
    return (
        <Link to={{pathname: "/generate"}} className="generate-new-button">
          Generate New Description
        </Link>
    );
}

export default GenerateButton;