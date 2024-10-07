import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AcquisitionState {
  isAcquiring: boolean;
  samplingRate: number;
  trigger: string;
  data: number[];
}

const initialState: AcquisitionState = {
  isAcquiring: false,
  samplingRate: 1000,
  trigger: 'manual',
  data: [],
};

const acquisitionSlice = createSlice({
  name: 'acquisition',
  initialState,
  reducers: {
    startAcquisition(state) {
      state.isAcquiring = true;
    },
    stopAcquisition(state) {
      state.isAcquiring = false;
    },
    singleAcquisition(state, action: PayloadAction<number[]>) {
      state.data = action.payload;
    },
    setSamplingRate(state, action: PayloadAction<number>) {
      state.samplingRate = action.payload;
    },
    setTrigger(state, action: PayloadAction<string>) {
      state.trigger = action.payload;
    },
    updateData(state, action: PayloadAction<number[]>) {
      state.data = action.payload;
    },
  },
});

export const {
  startAcquisition,
  stopAcquisition,
  singleAcquisition,
  setSamplingRate,
  setTrigger,
  updateData,
} = acquisitionSlice.actions;

export default acquisitionSlice.reducer;
