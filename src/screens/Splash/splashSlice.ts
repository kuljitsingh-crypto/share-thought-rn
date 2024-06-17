import {fetchCurrentUser} from '../../globalReducers/userSlice';
import {createCustomAsyncThunk} from '../../utill';
import {ScreenParamList, ScreenParamType} from '../screenTypes';

const pageDataLoader = 'app/splash/PAGE_DATA_LOADER';

export const loadData = createCustomAsyncThunk(
  pageDataLoader,
  async (params: any, {dispatch}) => {
    return dispatch(fetchCurrentUser());
  },
);
