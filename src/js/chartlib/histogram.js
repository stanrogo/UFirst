// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/histogram

import { map, max, extent, sum, scaleLinear, range, axisBottom, axisLeft, create, bin } from "d3";

export default function Histogram(data, {
    value = d => d, // convenience alias for x
    domain, // convenience alias for xDomain
    label, // convenience alias for xLabel
    format, // convenience alias for xFormat
    type = scaleLinear, // convenience alias for xType
    x = value, // given d in data, returns the (quantitative) x-value
    y = () => 1, // given d in data, returns the (quantitative) weight
    binCount = 40, // approximate number of bins to generate, or threshold function
    normalize, // whether to normalize values to a total of 100%
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 50, // left margin, in pixels
    width = 640, // outer width of chart, in pixels
    height = 400, // outer height of chart, in pixels
    insetLeft = 0.5, // inset left edge of bar
    insetRight = 0.5, // inset right edge of bar
    xType = type, // type of x-scale
    xDomain = domain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    xLabel = label, // a label for the x-axis
    xFormat = format, // a format specifier string for the x-axis
    yType = scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom - 20, marginTop + 20], // [bottom, top]
    yLabel = "↑ Frequency", // a label for the y-axis
    yFormat = normalize ? "%" : undefined, // a format specifier string for the y-axis
    color = "currentColor", // bar fill color
  } = {}) {
    // Compute values.
    const X = map(data, x);
    const Y0 = map(data, y);
    const I = range(X.length);
  
    // Compute bins.
    const [minim, maxim] = extent(X);
    const thresholds = range(minim, maxim, (maxim - minim) / binCount);
    const bins = bin().thresholds(thresholds).value(i => X[i])(I);
    const Y = Array.from(bins, I => sum(I, i => Y0[i]));
    if (normalize) {
      const total = sum(Y);
      for (let i = 0; i < Y.length; ++i) Y[i] /= total;
    }
  
    // Compute default domains.
    if (xDomain === undefined) xDomain = [bins[0].x0, bins[bins.length - 1].x1];
    if (yDomain === undefined) yDomain = [0, max(Y)];
  
    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = axisBottom(xScale).ticks(width / 80, xFormat).tickSizeOuter(0);
    const yAxis = axisLeft(yScale).ticks(height / 40, yFormat);
    yFormat = yScale.tickFormat(100, yFormat);
  
    const svg = create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 20)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
    svg.append("g")
        .attr("fill", color)
      .selectAll("rect")
      .data(bins)
      .join("rect")
        .attr("x", d => xScale(d.x0) + insetLeft)
        .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - insetLeft - insetRight))
        .attr("y", (d, i) => yScale(Y[i]))
        .attr("height", (d, i) => yScale(0) - yScale(Y[i]))
      .append("title")
        .text((d, i) => [`${d.x0} ≤ x < ${d.x1}`, yFormat(Y[i])].join("\n"));
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom - 20})`)
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width - marginRight)
            .attr("y", 40)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));
  
    return svg.node();
  }