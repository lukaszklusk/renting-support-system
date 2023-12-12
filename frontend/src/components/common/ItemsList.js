import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";

import useData from "../../hooks/useData";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect, useRef } from "react";

import "../../index.css";

function ItemsList({ items, ItemUI, itemProps }) {
  const slider = useRef(null);
  const { screenSize } = useData();
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const [settings, setSettings] = useState({
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: screenSize.width < 780 ? 1 : screenSize.width < 1200 ? 2 : 3,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, next) => {
      setActiveSlideIdx(next);
    },
  });

  const onScreenResize = () => {
    setActiveSlideIdx(0);
    setSettings((prevSettings) => {
      return {
        ...prevSettings,
        slidesToShow:
          screenSize.width < 780 ? 1 : screenSize.width < 1200 ? 2 : 3,
      };
    });
  };

  useEffect(onScreenResize, [screenSize]);

  return (
    <div
      className="container mt-2 mb-5 d-flex justify-content-center"
      style={{
        width: "100%",
      }}
    >
      <div className="flex-grow-2 d-flex align-items-center">
        <ArrowLeft
          onClick={() => slider?.current?.slickPrev()}
          style={{
            cursor: "pointer",
            visibility:
              settings.slidesToShow < items?.length && activeSlideIdx != 0
                ? "visible"
                : "hidden",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
        }}
      >
        <Slider ref={slider} {...settings}>
          {Array.isArray(items) &&
            items.map((item, idx) => (
              <ItemUI key={idx} item={item} {...itemProps} />
            ))}
        </Slider>
      </div>
      <div className="flex-grow-2 d-flex align-items-center">
        <ArrowRight
          onClick={() => slider?.current?.slickNext()}
          style={{
            cursor: "pointer",
            visibility:
              settings.slidesToShow < items?.length &&
              activeSlideIdx + settings.slidesToShow != items?.length
                ? "visible"
                : "hidden",
          }}
        />
      </div>
    </div>
  );
}

export default ItemsList;
