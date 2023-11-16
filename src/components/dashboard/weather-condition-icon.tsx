import type { JSXNode } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";
import type { WeatherCondition } from "../data/types";

import {
  BsSunFill,
  BsCloudSunFill,
  BsMoonFill,
  BsCloudyFill,
  BsCloudFogFill,
  BsCloudHailFill,
  BsCloudLightningFill,
  BsCloudLightningRainFill,
  BsCloudRainFill,
  BsCloudRainHeavyFill,
  BsCloudSnowFill,
  BsSnow,
  BsExclamation,
  BsWind,
} from "@qwikest/icons/bootstrap";

interface WeatherConditionIconProps {
  condition: WeatherCondition;
}

const DAY_CONDITION_ICON_MAPPING: Record<WeatherCondition, JSXNode> = {
  "clear-night": <BsMoonFill />,
  cloudy: <BsCloudyFill />,
  fog: <BsCloudFogFill />,
  hail: <BsCloudHailFill />,
  lightning: <BsCloudLightningFill />,
  "lightning-rainy": <BsCloudLightningRainFill />,
  partlycloudy: <BsCloudSunFill />,
  pouring: <BsCloudRainHeavyFill />,
  rainy: <BsCloudRainFill />,
  snowy: <BsSnow />,
  "snowy-rainy": <BsCloudSnowFill />,
  sunny: <BsSunFill />,
  windy: <BsWind />,
  "windy-variant": <BsWind />,
  exceptional: <BsExclamation />,
};

export const WeatherConditionIcon = component$<WeatherConditionIconProps>(
  (props) => {
    const { condition } = props;
    return <span>{DAY_CONDITION_ICON_MAPPING[condition]}</span>;
  }
);
