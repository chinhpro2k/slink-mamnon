import React, { useEffect, useState, useCallback } from 'react';
import 'react-image-gallery/styles/css/image-gallery.css';
import ImageGallery from 'react-image-gallery';
import styled from 'styled-components';

type Props = {
  isShow: boolean;
  onChangeShow: (isShow: boolean) => void;
  images: any;
  startIndex: number;
  isShowBullets: boolean;
  isShowFullscreenButton: boolean;
  isShowPlayButton: boolean;
  isShowThumbnails: boolean;
  isShowIndex: boolean;
  isShowNav: boolean;
};
const ImageViewWrapper = styled.div`
  #modal .modal-mark {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.45);
  }
  #modal .modal-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto;
    outline: 0;
  }
  #modal .modal-dialog {
    position: relative;
    top: 10px;
    box-sizing: border-box;
    width: auto;
    max-width: calc(100vw - 32px);
    margin: 0 auto;
    padding: 0 0 24px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none;
    pointer-events: none;
    font-feature-settings: 'tnum', 'tnum';
  }
  #modal .modal-content {
    position: relative;
    background-color: #fff0;
    background-clip: padding-box;
    border: 0;
    border-radius: 2px;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
      0 9px 28px 8px rgb(0 0 0 / 5%);
    pointer-events: auto;
  }
  #modal .model-body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5715;
    word-wrap: break-word;
    z-index: 999;
  }
  #modal .btn-close {
    float: right;
    margin: 10px 10px;
    cursor:pointer;
    z-index: 1000;
    position: relative;
  }
`;
const ViewerImages = ({
  isShow = false,
  onChangeShow = () => {},
  images = [],
  startIndex = 0,
  isShowBullets = false,
  isShowFullscreenButton = false,
  isShowPlayButton = false,
  isShowThumbnails = true,
  isShowIndex = false,
  isShowNav = true,
}: Props) => {
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  useEffect(() => {
    setIsOpenPopup(isShow);
  }, [isShow]);

  const handleTurnOf = () => {
    setIsOpenPopup(false);
    onChangeShow(false);
  };

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      handleTurnOf();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  return (
    <ImageViewWrapper>
      {isShow && (
        <div id="modal">
          <div className="modal-mark"></div>
          <div className="modal-wrap">
            <div className="modal-dialog" style={{ width: '100%', transformOrigin: '-148px 61px' }}>
              <div className="modal-content">
                <button
                  className="btn-close"
                  onClick={() => {
                    handleTurnOf();
                    // props.onCancel && props.onCancel();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    // className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ width: '16px', height: '16px' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="model-body" style={{ padding: '20px' }}>
                  <ImageGallery
                    items={images}
                    startIndex={startIndex}
                    showBullets={isShowBullets}
                    showFullscreenButton={isShowFullscreenButton}
                    showPlayButton={isShowPlayButton}
                    showThumbnails={isShowThumbnails}
                    showIndex={isShowIndex}
                    showNav={isShowNav}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*<div className="bg-image" />*/}
      {/*<div className="content">*/}
      {/*  <button type="button" className="box-viewer-close" onClick={handleTurnOf}>*/}
      {/*    <svg*/}
      {/*      aria-hidden="true"*/}
      {/*      focusable="false"*/}
      {/*      data-prefix="fas"*/}
      {/*      data-icon="times"*/}
      {/*      className="svg-inline--fa fa-times fa-w-11"*/}
      {/*      role="img"*/}
      {/*      xmlns="http://www.w3.org/2000/svg"*/}
      {/*      viewBox="0 0 352 512"*/}
      {/*    >*/}
      {/*      <path*/}
      {/*        fill="currentColor"*/}
      {/*        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"*/}
      {/*      />*/}
      {/*    </svg>*/}
      {/*  </button>*/}
      {/* */}
      {/*</div>*/}
    </ImageViewWrapper>
  );
};

export const BaseViewerImages = React.memo(ViewerImages);
