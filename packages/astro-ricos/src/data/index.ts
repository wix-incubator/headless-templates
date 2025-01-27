import textMock from "./textMock.json";
import paragraphMock from "./paragraphMock.json";
import headingMock from "./headingMock.json";

const nodesMock = {
  nodes: [...textMock.nodes, ...paragraphMock.nodes, ...headingMock.nodes],
};

export default nodesMock;
