import textMock from "./textMock.json";
import paragraphMock from "./paragraphMock.json";
import headingMock from "./headingMock.json";
// import imageMock from "./imageMock.json";
import captionMock from "./captionMock.json";
import orderedListMock from "./orderedListMock.json";

const ricosNodesMock = {
  nodes: [
    ...textMock.nodes,
    ...paragraphMock.nodes,
    ...headingMock.nodes,
    // ...imageMock.nodes,
    ...captionMock.nodes,
    ...orderedListMock.nodes,
  ],
};

export default ricosNodesMock;
