import { shallow, configure } from "enzyme";
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Videos from "../videos";
import Video from "../video";
import { render, screen, cleanup } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect";

configure({ adapter: new Adapter() });

afterEach(cleanup);

it("renders without crashing", () => {
    render(<Videos />);

    const element = screen.getByTestId("videoList");
    expect(element).toBeInTheDocument();
});

it("should not render Video component if data is empty", () => {
    const videosComponent = shallow(<Videos />);

    videosComponent.setState({
        data: null
    });

    expect(videosComponent.find(Video).length).toBe(0);
});

it("should render Video component if data is NOT empty", async () => {
    const videosComponent = shallow(<Videos />);

    videosComponent.setState({
        data: [{
            "id":1,
            "title":"sadsadsad",
            "image":"1637812660353-sample_1280x720_surfing_with_audio.mp4.jpg",
            "filename":"1637812660353-sample_1280x720_surfing_with_audio.mp4",
            "datetime":1637812661997
        }]
    });
    
    expect(videosComponent.find(Video).length).toBe(1);
});