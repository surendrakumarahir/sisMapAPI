/* eslint-disable linebreak-style */

exports.successResponse = function (res, msg) {
	var data = {
		status: 1,
		message: msg
	};
	return res.status(200).json(data);
};

exports.successResponseWithData = function (res, msg, data,count) {
	var resData = {
		status: 1,
		message: msg,
		data: data,
		count: count
	};
	return res.status(200).json(resData);
};

exports.ErrorResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg
	};
	return res.status(200).json(data);
};

exports.notFoundResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(404).json(data);
};

exports.noRecordFound = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(406).json(data);
};

exports.validationErrorWithData = function (res, msg, data) {
	var resData = {
		status: 0,
		message: msg,
		data: data
	};
	return res.status(400).json(resData);
};

exports.validationError = function (res, msg) {
	var resData = {
		status: 0,
		message: msg
	};
	return res.status(400).json(resData);
};

exports.unauthorizedResponse = function (res, msg) {
	var data = {
		status: 0,
		message: msg,
	};
	return res.status(401).json(data);
};