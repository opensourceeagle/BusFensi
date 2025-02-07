import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { initialState, OSMMapState } from "./initialState";
import { CommitAction, createCommitActionSlice } from "./slice/commit/action";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand";
import { temporal } from "zundo";
import { computed, ComputedFeatures } from "./computed";
import { createFeatureStateActionSlice, FeatureStateAction } from "./slice/featureState/action";
import { createMetaActionSlice, MetaAction } from "./slice/meta/action";
import { createRemoteApiActionSlice, RemoteApiAction } from "./slice/remote/action";

export type OSMMapStore = OSMMapState
    & CommitAction
    & FeatureStateAction
    & MetaAction
    & RemoteApiAction

export type OSMMapStoreWithComputed = OSMMapStore & ComputedFeatures

const storageOptions = {
    name: 'OSMMapStateStore',
    storage: createJSONStorage<OSMMapStoreWithComputed>(() => localStorage),
}

export const useOSMMapStore = create<OSMMapStore>()(
    devtools(
        persist(
            computed(
                temporal(
                    immer(
                        (...params) => ({
                            ...initialState,
                            ...createCommitActionSlice(...params),
                            ...createFeatureStateActionSlice(...params),
                            ...createMetaActionSlice(...params),
                            ...createRemoteApiActionSlice(...params),
                        })
                    ), {
                    partialize: (state) => {
                        // may ignore some value in future
                        const { ...tracked } = state;
                        return tracked;
                    },
                    equality: (pastState, currentState) => {
                        return pastState.commitCounter === currentState.commitCounter
                    },
                }),
            ),
            storageOptions
        ),
        { name: 'OSMMapState' }
    ),  // devtools applied after persist
);