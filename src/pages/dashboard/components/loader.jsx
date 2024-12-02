import { Oval } from "react-loader-spinner";
import PropTypes from "prop-types";

const Loader = ({ visible=true, height=20, width=20, color="#ffffff", secondaryColor="f2f2f2", strokeWidth="8"}) => {
  return <Oval visible={visible} strokeWidth={strokeWidth} height={height} width={width} color={color} secondaryColor={secondaryColor} ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />;
};

Loader.propTypes = {
  visible: PropTypes.bool,
  height: PropTypes.number,
  width: PropTypes.number,
  color: PropTypes.string,
  secondaryColor: PropTypes.string,
  strokeWidth: PropTypes.string,
};


export default Loader;
