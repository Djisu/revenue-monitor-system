// src/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export var useAppDispatch = function () { return useDispatch(); };
export var useAppSelector = useSelector;
