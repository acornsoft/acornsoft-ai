import { hasMeaningful, looksLikeEmail } from "@/lib/start-climb-prefs";

export type ClimbStationId =
  | "start"
  | "basecamp"
  | "route"
  | "waypoint"
  | "summit"
  | "descent";

export type StationStatus = "locked" | "open" | "done" | "narrative";

export type ClimbBeats = {
  name: string;
  email: string;
  problem: string;
  measure: string;
  slice: string;
};

export function stationStatus(
  id: ClimbStationId,
  beats: ClimbBeats,
): StationStatus {
  switch (id) {
    case "start":
      return identityReady(beats) ? "done" : "open";
    case "basecamp":
      return hasMeaningful(beats.problem) ? "done" : "open";
    case "route":
      if (!hasMeaningful(beats.problem)) return "locked";
      return hasMeaningful(beats.measure) ? "done" : "open";
    case "waypoint":
      if (!hasMeaningful(beats.measure)) return "locked";
      return hasMeaningful(beats.slice) ? "done" : "open";
    case "summit":
    case "descent":
      return "narrative";
    default: {
      const _never: never = id;
      return _never;
    }
  }
}

export function allStationStatuses(
  beats: ClimbBeats,
): Record<ClimbStationId, StationStatus> {
  return {
    start: stationStatus("start", beats),
    basecamp: stationStatus("basecamp", beats),
    route: stationStatus("route", beats),
    waypoint: stationStatus("waypoint", beats),
    summit: stationStatus("summit", beats),
    descent: stationStatus("descent", beats),
  };
}

export function identityReady(beats: Pick<ClimbBeats, "name" | "email">): boolean {
  return beats.name.trim().length >= 2 && looksLikeEmail(beats.email);
}

export function senderBeatsReady(beats: ClimbBeats): boolean {
  return (
    hasMeaningful(beats.problem) &&
    hasMeaningful(beats.measure) &&
    hasMeaningful(beats.slice)
  );
}

export function climbReadyToSend(beats: ClimbBeats): boolean {
  return identityReady(beats) && senderBeatsReady(beats);
}

export function nextOpenStation(beats: ClimbBeats): ClimbStationId {
  if (!identityReady(beats)) return "start";
  if (!hasMeaningful(beats.problem)) return "basecamp";
  if (!hasMeaningful(beats.measure)) return "route";
  if (!hasMeaningful(beats.slice)) return "waypoint";
  return "waypoint";
}

export function stationFieldId(id: ClimbStationId): string | null {
  switch (id) {
    case "start":
      return "ac-start-name";
    case "basecamp":
      return "ac-start-problem";
    case "route":
      return "ac-start-measure";
    case "waypoint":
      return "ac-start-slice";
    case "summit":
    case "descent":
      return null;
    default: {
      const _never: never = id;
      return _never;
    }
  }
}
