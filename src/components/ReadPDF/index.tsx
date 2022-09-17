import React, { FC, useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import axios from 'axios';
import { LeftOutlined, RightOutlined, DownloadOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import FileDownload from 'js-file-download';

interface IProps {
  fileUrl: string;
}
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const PdfWraper = styled.div`
  .pdf-view {
    position: relative;
  }
  .btn-read {
    position: absolute;
    top: 50%;
    cursor: pointer;
  }
  .btn-next {
    right: 0;
  }
  .btn-prev {
    left: 0;
  }
  .page-status {
    display: flex;
    justify-content: center;
    font-weight: 600;
    text-align: center;
  }
  .select-page {
    display: flex;
  }
  .line {
    margin: 0 8px;
    border-right: 1px solid #f0f0f0;
  }
  .page-pdf {
    display: flex;
    justify-content: center;
    height: calc(100vh) !important;
  }
  .page-pdf > canvas {
    max-width: 100%;
    height: calc(100vh) !important;
  }
  .download {
    button {
      color: #007a3a;
      background: #ffffff;
      border: 1px solid #007a3a;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        color: #ffffff;
        background: #007a3a;
      }
    }
  }
`;
const ReadPDF: FC<IProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [arrNum, setArrNum] = useState([]);
  const [showBar, setShowBar] = useState(false);
  const [data, setData] = useState();
  const [loadingText, setLoadingText] = useState(
    'Đang tải tài liệu. Vui lòng chờ trong giây lát...',
  );
  const documentRef = useRef<HTMLDivElement>();
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });
  useEffect(() => {
    axios({
      url: fileUrl + '?original=0',
      method: 'GET',
      responseType: 'blob', // Important
    })
      .then((response) => setData(response.data))
      .catch(() =>
        setLoadingText('Lỗi tải file. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết'),
      );
  }, [fileUrl]);
  const handleDownload = () => {
    axios({
      url: fileUrl + '?original=0',
      method: 'GET',
      responseType: 'arraybuffer', // Important
    })
      .then((response) => FileDownload(response.data, `Danh-gia-hoc-sinh.pdf`))
      .catch(() =>
        setLoadingText('Lỗi tải file. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết'),
      );
  };
  const handleScroll = (e: any) => {
    if (documentRef.current) {
      if (documentRef.current.contains(e.target)) {
        if (e.wheelDelta > 0) {
          if (!(pageNumber <= 1)) {
            changePage(-1);
          }
        } else {
          if (!(pageNumber >= numPages)) {
            changePage(1);
          }
        }
      }
    }
  };
  useEffect(() => {
    // window.addEventListener('wheel', handleScroll);

    return () => {
      // window.removeEventListener('wheel', handleScroll);
    };
  }, [numPages, pageNumber]);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    const newArr = [];
    for (let i = 0; i < numPages; i++) {
      newArr.push(i + 1);
    }
    setArrNum(newArr);
  };

  const changePage = (offset) => setPageNumber((prevPageNumber) => prevPageNumber + offset);
  const onChangeSelectPage = (text) => {
    setPageNumber(Number(text.target.value));
  };
  const previousPage = () => changePage(-1);

  const nextPage = () => changePage(1);

  const onZoomIn = () => {
    if (zoom >= 1 && zoom < 5) {
      const zoomNumber = zoom + 0.2;
      setZoom(zoomNumber);
    }
  };

  const onZoomOut = () => {
    if (zoom > 1 && zoom < 5) {
      const zoomNumber = zoom - 0.2;
      setZoom(zoomNumber);
    }
  };

  return (
    <React.Fragment>
      <PdfWraper>
        <div className="page-status ">
          <div>
            PAGE {pageNumber || (numPages ? 1 : '--')} / {numPages || '--'}
          </div>
          <div className="line"></div>
          <div className="select-page ">
            <div className="text-white font-bold" style={{ marginRight: '6px' }}>
              Select Page:{' '}
            </div>
            <select
              className="block w-16 text-gray-900 text-center focus:outline-none py-2 rounded-full"
              onChange={onChangeSelectPage}
              value={pageNumber}
            >
              {arrNum &&
                arrNum.length &&
                arrNum.map((item) => {
                  return (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="line"></div>
          <div className="download">
            <button onClick={() => handleDownload()}>
              Download <DownloadOutlined />
            </button>
          </div>
        </div>
        <div className="pdf-view" ref={documentRef}>
          <Document file={data} onLoadSuccess={onDocumentLoadSuccess}>
            <Page className={'page-pdf'} pageNumber={pageNumber} scale={zoom} />
          </Document>
        </div>
        {!(pageNumber >= numPages) && (
          <div className="btn-read btn-next absolute" onClick={nextPage}>
            <RightOutlined style={{ fontSize: '32px' }} />
          </div>
        )}
        {!(pageNumber <= 1) && (
          <div className="btn-read btn-prev absolute" onClick={previousPage}>
            <LeftOutlined style={{ fontSize: '32px' }} />
          </div>
        )}
      </PdfWraper>
    </React.Fragment>
  );
};

export default ReadPDF;
