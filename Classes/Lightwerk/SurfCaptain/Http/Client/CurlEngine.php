<?php
namespace Lightwerk\SurfCaptain\Http\Client;

/*                                                                        *
 * This script belongs to the TYPO3 Flow framework.                       *
 *                                                                        *
 * It is free software; you can redistribute it and/or modify it under    *
 * the terms of the GNU Lesser General Public License, either version 3   *
 * of the License, or (at your option) any later version.                 *
 *                                                                        *
 * The TYPO3 project - inspiring people to share!                         *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Http\Request;
use TYPO3\Flow\Http\Response;
use TYPO3\Flow\Http\Client\CurlEngineException;

/**
 * A Request Engine which uses cURL in order to send requests to external
 * HTTP servers.
 */
class CurlEngine extends \TYPO3\Flow\Http\Client\CurlEngine {

	/**
	 * Sends the given HTTP request
	 *
	 * @param \TYPO3\Flow\Http\Request $request
	 * @return \TYPO3\Flow\Http\Response The response or FALSE
	 * @api
	 * @throws \TYPO3\Flow\Http\Exception
	 * @throws CurlEngineException
	 */
	public function sendRequest(Request $request) {
		if (!extension_loaded('curl')) {
			throw new \TYPO3\Flow\Http\Exception('CurlEngine requires the PHP CURL extension to be installed and loaded.', 1346319808);
		}

		$requestUri = $request->getUri();
		$curlHandle = curl_init((string)$requestUri);

		curl_setopt_array($curlHandle, $this->options);

		// If the content is a stream resource, use cURL's INFILE feature to stream it
		$content = $request->getContent();
		if (is_resource($content)) {
			curl_setopt_array($curlHandle,
				array(
					CURLOPT_INFILE => $content,
					CURLOPT_INFILESIZE => $request->getHeader('Content-Length'),
				)
			);
		}

		switch ($request->getMethod()) {
			case 'GET' :
				if ($request->getContent()) {
					// workaround because else the request would implicitly fall into POST:
					curl_setopt($curlHandle, CURLOPT_CUSTOMREQUEST, 'GET');
					if (!is_resource($content)) {
						curl_setopt($curlHandle, CURLOPT_POSTFIELDS, $content);
					}
				}
			break;
			case 'POST' :
				curl_setopt($curlHandle, CURLOPT_POST, TRUE);
				if (!is_resource($content)) {
					$body = $content !== '' ? $content : http_build_query($request->getArguments());
					curl_setopt($curlHandle, CURLOPT_POSTFIELDS, $body);
				}
			break;
			case 'PUT' :
				curl_setopt($curlHandle, CURLOPT_PUT, TRUE);
				if (!is_resource($content) && $content !== '') {
					$inFileHandler = fopen('php://temp', 'r+');
					fwrite($inFileHandler, $request->getContent());
					rewind($inFileHandler);
					curl_setopt_array($curlHandle, array(
						CURLOPT_INFILE => $inFileHandler,
						CURLOPT_INFILESIZE => strlen($request->getContent()),
					));
				}
			break;
			default:
				curl_setopt($curlHandle, CURLOPT_CUSTOMREQUEST, $request->getMethod());
		}

		$preparedHeaders = array();
		foreach ($request->getHeaders()->getAll() as $fieldName => $values) {
			foreach ($values as $value) {
				$preparedHeaders[] = $fieldName . ': ' . $value;
			}
		}

		// Send an empty Expect header in order to avoid chunked data transfer (which we can't handle yet).
		// If we don't set this, cURL will set "Expect: 100-continue" for requests larger than 1024 bytes.
		$preparedHeaders[] = 'Expect:';

		// Respect headers set by options
		if (isset($this->options[CURLOPT_HTTPHEADER]) && is_array($this->options[CURLOPT_HTTPHEADER])) {
			$preparedHeaders = array_merge($preparedHeaders, $this->options[CURLOPT_HTTPHEADER]);
		}

		// set CURLOPT_HTTPHEADER only once
		curl_setopt($curlHandle, CURLOPT_HTTPHEADER, $preparedHeaders);

		// curl_setopt($curlHandle, CURLOPT_PROTOCOLS, CURLPROTO_HTTP && CURLPROTO_HTTPS);
		// CURLOPT_UPLOAD

		if ($requestUri->getPort() !== NULL) {
			curl_setopt($curlHandle, CURLOPT_PORT, $requestUri->getPort());
		}

		// CURLOPT_COOKIE

		$curlResult = curl_exec($curlHandle);
		if ($curlResult === FALSE) {
			throw new CurlEngineException('cURL reported error code ' . curl_errno($curlHandle) . ' with message "' . curl_error($curlHandle) . '". Last requested URL was "' . curl_getinfo($curlHandle, CURLINFO_EFFECTIVE_URL) . '".', 1338906040);
		} elseif (strlen($curlResult) === 0) {
			return FALSE;
		}
		curl_close($curlHandle);

		$response = Response::createFromRaw($curlResult);
		if ($response->getStatusCode() === 100) {
			$response = Response::createFromRaw($response->getContent(), $response);
		}
		return $response;
	}

}
