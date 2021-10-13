import React from "react";
import Chart from 'react-apexcharts'
import { connect } from 'react-redux'
import Spinner from './Spinner'
import { chartOptions, dummyData } from './PriceChart.config'
import {
    priceChartLoadedSelector,
    priceChartSelector
} from '../store/storeSelectors'

const priceSymbol = (lastPriceChange) => {
    let output;
    if (lastPriceChange === '+') {
        output = <span className='text-success'>&#9650;</span> // HTML green up triangle
    } else {
        output = <span className='text-danger'>&#9660;</span> // HTML red down triangle
    }
    return output;
}

const showPriceChart = (priceChart) => {
    console.log("PRICE", priceChart)
    return (
        <div className='price-chart'>
            <div className='price'>
                <h4>PBS/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp; {priceChart.lastPrice}</h4>
            </div>
            <Chart 
            options={chartOptions}
            series={priceChart.series}
            type="candlestick"
            width="100%"
            height="100%"
            />
        </div>
    )
}

function PriceChart({ priceChartLoaded, priceChart }) {
  return (
    <div className="card bg-dark text-white">
      <div className="card-header">
          Price Chart
          </div>
      <div className="card-body">
          { priceChartLoaded ? showPriceChart(priceChart) : <Spinner />}
      </div>
    </div>
  );
}

const hydrateRedux = (state) => {
    return ({
        priceChartLoaded: priceChartLoadedSelector(state),
        priceChart: priceChartSelector(state)
    })
}

export default connect(hydrateRedux)(PriceChart);
