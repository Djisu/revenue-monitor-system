var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// Function to convert a File to Base64
var fileToBase64 = function (file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () {
            var base64String = reader.result;
            resolve(base64String.split(',')[1]); // Remove the data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
var BASE_URL = import.meta.env.VITE_BASE_URL ||
    (import.meta.env.MODE === 'development' ? 'http://localhost:3000' : 'https://typescript-church-new.onrender.com');
// Define the thunk for storing a photo
export var storePhotoAsync = createAsyncThunk('photos/store', function (_a, _b) { return __awaiter(void 0, [_a, _b], void 0, function (_c, _d) {
    var base64Photo, response, err_1, errorMessage_1, errorMessage;
    var _e, _f, _g, _h, _j;
    var photo = _c.photo, officer_no = _c.officer_no;
    var rejectWithValue = _d.rejectWithValue;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _k.trys.push([0, 3, , 4]);
                console.log('in storePhotoAsync thunk');
                console.log('photo.name:', photo.name);
                console.log('officer_no:', officer_no);
                if (!photo || !photo.name || !officer_no) {
                    throw new Error('Invalid photo or officer number');
                }
                return [4 /*yield*/, fileToBase64(photo)];
            case 1:
                base64Photo = _k.sent();
                return [4 /*yield*/, axios.post("".concat(BASE_URL, "/api/photos/store"), {
                        officer_no: officer_no,
                        photo: base64Photo,
                        photo_name: photo.name,
                        photo_type: photo.type,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })];
            case 2:
                response = _k.sent();
                console.log('after axios.post response:', response.data); //photoUrl);
                return [2 /*return*/, response.data];
            case 3:
                err_1 = _k.sent();
                if (axios.isAxiosError(err_1) && ((_e = err_1.response) === null || _e === void 0 ? void 0 : _e.status) === 409) {
                    errorMessage_1 = ((_g = (_f = err_1.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.message) || 'Photo already exists';
                    return [2 /*return*/, rejectWithValue({ error: errorMessage_1 })];
                }
                errorMessage = ((_j = (_h = err_1.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.message) || 'Failed to store photo';
                return [2 /*return*/, rejectWithValue({ error: errorMessage })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Define the thunk for retrieving a photo
export var getPhotoAsync = createAsyncThunk('photos/get', function (officer_no_1, _a) { return __awaiter(void 0, [officer_no_1, _a], void 0, function (officer_no, _b) {
    var response, err_2;
    var _c;
    var rejectWithValue = _b.rejectWithValue;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/photos/retrieve/").concat(officer_no), {
                        responseType: 'arraybuffer'
                    })];
            case 1:
                response = _d.sent();
                return [2 /*return*/, Buffer.from(response.data)];
            case 2:
                err_2 = _d.sent();
                return [2 /*return*/, rejectWithValue(((_c = err_2.response) === null || _c === void 0 ? void 0 : _c.data) || { error: 'Failed to get photo' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Define the thunk for retrieving all photos
export var getAllPhotosAsync = createAsyncThunk('photos/getAll', function (_1, _a) { return __awaiter(void 0, [_1, _a], void 0, function (_, _b) {
    var response, err_3;
    var _c;
    var rejectWithValue = _b.rejectWithValue;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.get("".concat(BASE_URL, "/photos/retrieve"), {
                        responseType: 'json'
                    })];
            case 1:
                response = _d.sent();
                // Convert each photo ArrayBuffer to Buffer
                return [2 /*return*/, response.data.map(function (photoData) { return ({
                        officer_no: photoData.officer_no,
                        photo: Buffer.from(photoData.photo)
                    }); })];
            case 2:
                err_3 = _d.sent();
                return [2 /*return*/, rejectWithValue(((_c = err_3.response) === null || _c === void 0 ? void 0 : _c.data) || { error: 'Failed to get photos' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Define the thunk for deleting a photo
export var deletePhotoAsync = createAsyncThunk('photos/delete', function (officer_no_1, _a) { return __awaiter(void 0, [officer_no_1, _a], void 0, function (officer_no, _b) {
    var response, err_4;
    var _c;
    var rejectWithValue = _b.rejectWithValue;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios.delete("".concat(BASE_URL, "/photos/delete/").concat(officer_no))];
            case 1:
                response = _d.sent();
                return [2 /*return*/, response.data];
            case 2:
                err_4 = _d.sent();
                return [2 /*return*/, rejectWithValue(((_c = err_4.response) === null || _c === void 0 ? void 0 : _c.data) || { error: 'Failed to delete photo' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Initial State
var initialState = {
    status: 'idle',
    message: null,
    photos: [],
    error: null,
    photoUrl: null // Add a field for photoUrl
};
// Slice
var photosSlice = createSlice({
    name: 'photos',
    initialState: initialState,
    reducers: {},
    extraReducers: function (builder) {
        builder
            .addCase(storePhotoAsync.pending, function (state) {
            state.status = 'loading';
            state.error = null;
            state.photoUrl = null; // Reset the photoUrl
            state.message = null;
        })
            .addCase(storePhotoAsync.fulfilled, function (state, action) {
            state.status = 'succeeded';
            state.message = action.payload.message;
            state.error = null;
            state.photoUrl = action.payload.photoUrl; // Set the photoUrl
        })
            .addCase(storePhotoAsync.rejected, function (state, action) {
            var _a, _b;
            state.status = 'failed';
            state.message = null;
            state.error = ((_a = action.payload) === null || _a === void 0 ? void 0 : _a.error) || 'Failed to store photo';
            state.photoUrl = null; // Clear the photoUrl on failure
            // Optionally, you can add a specific case for 409
            if ((_b = action.payload) === null || _b === void 0 ? void 0 : _b.error.includes('Photo already exists')) {
                state.error = 'Photo already exists';
            }
        })
            .addCase(getPhotoAsync.pending, function (state) {
            state.status = 'loading';
            state.error = null;
        })
            .addCase(getPhotoAsync.fulfilled, function (state, action) {
            state.status = 'succeeded';
            state.message = 'Photo retrieved successfully';
            state.error = null;
            state.photos = [{ officer_no: '', photo: action.payload }]; // Update photos array
        })
            .addCase(getPhotoAsync.rejected, function (state, action) {
            var _a;
            state.status = 'failed';
            state.error = ((_a = action.error) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to get photo';
        })
            .addCase(getAllPhotosAsync.pending, function (state) {
            state.status = 'loading';
            state.error = null;
        })
            .addCase(getAllPhotosAsync.fulfilled, function (state, action) {
            state.status = 'succeeded';
            state.photos = action.payload;
            state.error = null;
        })
            .addCase(getAllPhotosAsync.rejected, function (state, action) {
            var _a;
            state.status = 'failed';
            state.error = ((_a = action.error) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to get photos';
        })
            .addCase(deletePhotoAsync.pending, function (state) {
            state.status = 'loading';
            state.error = null;
        })
            .addCase(deletePhotoAsync.fulfilled, function (state, action) {
            state.status = 'succeeded';
            state.message = action.payload.message;
            state.error = null;
        })
            .addCase(deletePhotoAsync.rejected, function (state, action) {
            var _a;
            state.status = 'failed';
            state.error = ((_a = action.error) === null || _a === void 0 ? void 0 : _a.message) || 'Error deleting photo';
        });
    },
});
export default photosSlice.reducer;
