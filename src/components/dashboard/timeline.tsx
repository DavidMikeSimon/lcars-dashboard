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

import { HourlyWeatherForecast } from "../data/types";

interface TimelineProps {
  forecasts: HourlyWeatherForecast[];
}

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
    visTimeline.value = noSerialize(
      new VisTimeline(document.getElementById(id)!, items, {
        rollingMode: { follow: true, offset: 0.1 },
        height: "15rem",
        selectable: false,
      })
    );
  });

  return <div class="timeline" id={id} />;
});
