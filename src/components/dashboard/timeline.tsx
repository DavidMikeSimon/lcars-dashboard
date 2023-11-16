import {
  NoSerialize,
  component$,
  noSerialize,
  useId,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

import { Timeline as VisTimeline } from "vis-timeline";
import "vis-timeline/dist/vis-timeline-graph2d.min.css";
import moment from "moment";

import { HourlyWeatherForecast } from "../data/types";

interface TimelineProps {
  forecasts: HourlyWeatherForecast[];
}

const VISIBLE_TIME_SPAN_HOURS = 12;
const ROLLING_OFFSET = 0.1;

export const Timeline = component$<TimelineProps>((props) => {
  const visTimeline = useSignal<NoSerialize<VisTimeline>>();
  const id = useId();
  const { forecasts } = props;

  useVisibleTask$(({ track }) => {
    track(() => forecasts);
    const items = forecasts.map((f) => ({
      id: f.date_time.valueOf(),
      content: f.condition,
      start: f.date_time,
    }));

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
      new VisTimeline(document.getElementById(id)!, items, {
        rollingMode: { follow: true, offset: ROLLING_OFFSET },
        height: "10rem",
        selectable: false,
        zoomable: false,
        start: start.toDate(),
        end: end.toDate(),
        timeAxis: { scale: "hour", step: 1 },
        format: {
          minorLabels: (date) => moment(date).format("ha"),
        },
      })
    );
  });

  return <div class="timeline" id={id} />;
});
