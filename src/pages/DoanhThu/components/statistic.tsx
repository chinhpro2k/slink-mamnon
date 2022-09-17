import styled from 'styled-components';

export interface IDataStatistic {
  title: string;
  value: string | number;
  unit?: string;
}
interface IProps {
  data: IDataStatistic[];
  type?: 'basic' | 'color';
}
const StatisticDayWrapper = styled.div`
  .line-item {
    height: 70px;
    border-right: 1px solid #000000;
  }

  .list-statistic-day {
    display: flex;
    align-items: center;
    //justify-content: space-between;
    //display: grid;
    //grid-gap: 16px;
    //grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
    //grid-template-rows: repeat(3, [row] auto  );
    //grid-template-columns: repeat(5, [col] auto ) ;
    margin-bottom: 20px;
  }
  .list-item-color {
    min-height: 142px;
    width: 100%;
    margin-right: 16px;
    padding: 16px;
    background-color: #ffffff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    border-radius: 8px;
    -webkit-box-shadow: -1px 1px 5px 2px #ececec;
    -moz-box-shadow: -1px 1px 5px 2px #ececec;
    box-shadow: -1px 1px 5px 2px #ececec;
    .title {
      color: #c0c0c0;
      font-weight: 600;
      font-size: 16px;
    }
    .value {
      font-weight: 600;
      font-size: 32px;
    }
    span {
      margin-left: 4px;
      color: #c0c0c0;
      font-size: 16px;
    }
    &:last-of-type {
      margin-right: 0;
    }
    &:first-of-type {
      background-image: url('./images/bg-chart-1.png');
      background-color: #20A8D7;
    }
    &:nth-child(2) {
      background-image: url('./images/bg-chart-2.png');
      background-color: #63C2DF;
    }
    &:nth-child(3) {
      background-image: url('./images/bg-chart-3.png');
      background-color: #FACB03;
    }
    &:nth-child(4) {
      background-image: url('./images/bg-chart-4.png');
      background-color: #F96C6C;
    }
    //&:nth-child(4){
    //  background-image: url("../../../../public/images/bg-chart-4.png");
    //  background-repeat: no-repeat;
    //  background-size: cover;
    //  background-position: center;
    //}
  }
  .list-item {
    min-height: 142px;
    width: 100%;
    margin-right: 16px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 8px;
    -webkit-box-shadow: -1px 1px 5px 2px #ececec;
    -moz-box-shadow: -1px 1px 5px 2px #ececec;
    box-shadow: -1px 1px 5px 2px #ececec;
    .title {
      color: #c0c0c0;
      font-weight: 600;
      font-size: 16px;
    }
    .value {
      font-weight: 600;
      font-size: 32px;
    }
    span {
      margin-left: 4px;
      color: #c0c0c0;
      font-size: 16px;
    }
  }
  .bg-green {
    background-color: #ccff99;
  }
  .bg-yellow {
    background-color: #ffffcc;
  }
  .bg-blue {
    background-color: #ccffff;
  }
  .bg-red {
    background-color: #ffcccc;
  }
  .bg-green-s {
    background-color: #33cc99;
  }
  .value-color {
    margin-bottom: 0;
    color: #ffffff;
    font-weight: 700;
    font-size: 28px;
    font-style: normal;
    line-height: 36px;
    span {
      color: #ffffff;
    }
  }
  .title-color {
    display: flex;
    align-items: center;
    color: #ffffff;
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 36px;
  }
`;
const Statistic = (props: IProps) => {
  return (
    <StatisticDayWrapper>
      <div className="list-statistic-day">
        {props.data.map((val, i) => {
          return (
            <div
              className={`${
                props.type === 'basic' || !props.type ? 'list-item' : 'list-item-color'
              }`}
              key={i}
            >
              {props.type === 'basic' || !props.type ? (
                <>
                  <p className="title">{val.title}</p>
                  <p className="value">
                    {val.value ?? 0}
                    {val.unit && <span>{val.unit}</span>}
                  </p>
                </>
              ) : (
                <>
                  <p className="value-color">
                    {val.value ?? 0}
                    {val.unit && <span>{val.unit}</span>}
                  </p>
                  <p className="title-color">{val.title}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </StatisticDayWrapper>
  );
};
export default Statistic;
