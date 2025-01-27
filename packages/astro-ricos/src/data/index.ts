import textMock from "./textMock.json";
import paragraphMock from "./paragraphMock.json";
import headingMock from "./headingMock.json";
// import imageMock from "./imageMock.json";
import captionMock from "./captionMock.json";

const ricosNodesMock = {
  nodes: [
    ...textMock.nodes,
    ...paragraphMock.nodes,
    ...headingMock.nodes,
    // ...imageMock.nodes,
    ...captionMock.nodes,
  ],
};

export default ricosNodesMock;
