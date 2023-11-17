import type { NoSerialize } from "@builder.io/qwik";
import {
  component$,
  noSerialize,
  render,
  useId,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

import type { DataItem } from "vis-timeline";
import { Timeline as VisTimeline } from "vis-timeline";
import "vis-timeline/dist/vis-timeline-graph2d.min.css";
import moment from "moment";

import type { HourlyWeatherForecast } from "../data/types";
import { HourlyForecastSmall } from "./hourly-forecast-small";

interface TimelineProps {
  forecasts: HourlyWeatherForecast[];
}

const VISIBLE_TIME_SPAN_HOURS = 16;
const ROLLING_OFFSET = 0.1;

const FORECASTS_GROUP = "forecasts";

export const Timeline = component$<TimelineProps>((props) => {
  const visTimeline = useSignal<NoSerialize<VisTimeline>>();
  const id = useId();
  const { forecasts } = props;

  useVisibleTask$(({ track }) => {
    track(() => forecasts);
    const groups = [
      {
        id: FORECASTS_GROUP,
        content: "",
        className: "forecasts",
      },
    ];

    const items: DataItem[] = forecasts.map((f) => ({
      id: f.date_time.valueOf(),
      content: f,
      start: f.date_time,
      group: FORECASTS_GROUP,
    })) as unknown as DataItem[];

    if (visTimeline.value !== undefined) {
      visTimeline.value.destroy();
    }

    const now = moment();
    const start = moment(now).subtract(
      VISIBLE_TIME_SPAN_HOURS * ROLLING_OFFSET,
      "hours"
    );
    const end = moment(now).add(
      VISIBLE_TIME_SPAN_HOURS * (1.0 - ROLLING_OFFSET),
      "hours"
    );
    visTimeline.value = noSerialize(
      new VisTimeline(document.getElementById(id)!, items, groups, {
        //rollingMode: { follow: true, offset: ROLLING_OFFSET },
        height: "15rem",
        selectable: false,
        zoomable: false,
        start: start.toDate(),
        end: end.toDate(),
        timeAxis: { scale: "hour", step: 1 },
        format: {
          minorLabels: (date) => moment(date).format("ha"),
        },
        template: (item, elem) => {
          const forecast = item.content as HourlyWeatherForecast;
          render(elem, <HourlyForecastSmall forecast={forecast} />);
          return "";
        },
      })
    );
  });

  return <div class="timeline" id={id} />;
});
