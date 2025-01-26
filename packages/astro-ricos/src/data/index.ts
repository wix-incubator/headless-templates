import textMock from "./textMock.json";
import paragraphMock from "./paragraphMock.json";

const nodesMock = {
  nodes: [...textMock.nodes, ...paragraphMock.nodes],
};

export default nodesMock;
