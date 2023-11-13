module.exports = {
	400: {
		message: "Bad Request",
		description:
			"The server could not understand the request due to invalid syntax.",
	},
	401: {
		message: "Unauthorized",
		description:
			'Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.',
	},
	402: {
		message: "Payment Required",
		description:
			"This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.",
	},
	403: {
		message: "Forbidden",
		description:
			"The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401, the client's identity is known to the server.",
	},
	404: {
		message: "Not Found",
		description:
			"The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurrence on the web.",
	},
	405: {
		message: "Method Not Allowed",
		description:
			"The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.",
	},
	406: {
		message: "Not Acceptable",
		description:
			"This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.",
	},
	407: {
		message: "Proxy Authentication Required",
		description:
			"This is similar to 401 but authentication is needed to be done by a proxy.",
	},
	408: {
		message: "Request Timeout",
		description:
			"This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.",
	},
	409: {
		message: "Conflict",
		description:
			"This response is sent when a request conflicts with the current state of the server.",
	},
	410: {
		message: "Gone",
		description:
			'This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code',
	},
	411: {
		message: "Length Required",
		description:
			"Server rejected the request because the Content-Length header field is not defined and the server requires it.",
	},
	412: {
		message: "Precondition Failed",
		description:
			"The client has indicated preconditions in its headers which the server does not meet.",
	},
	413: {
		message: "Payload Too Large",
		description:
			"Request entity is larger than limits defined by server; the server might close the connection or return an Retry-After header field.",
	},
	414: {
		message: "URI Too Long",
		description:
			"The URI requested by the client is longer than the server is willing to interpret.",
	},
	415: {
		message: "Unsupported Media Type",
		description:
			"The media format of the requested data is not supported by the server, so the server is rejecting the request.",
	},
	416: {
		message: "Range Not Satisfiable",
		description:
			"The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.",
	},
	417: {
		message: "Expectation Failed",
		description:
			"This response code means the expectation indicated by the Expect request header field can't be met by the server.",
	},
	418: {
		message: "I'm a teapot",
		description: "The server refuses the attempt to brew coffee with a teapot.",
	},
	421: {
		message: "Misdirected Request",
		description:
			"The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.",
	},
	422: {
		message: "Unprocessable Entity ",
		description:
			"The request was well-formed but was unable to be followed due to semantic errors.",
	},
	423: {
		message: "Locked",
		description: "The resource that is being accessed is locked.",
	},
	424: {
		message: "Failed Dependency",
		description: "The request failed due to failure of a previous request.",
	},
	425: {
		message: "Too Early",
		description:
			"Indicates that the server is unwilling to risk processing a request that might be replayed.",
	},
	426: {
		message: "Upgrade Required",
		description:
			"The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).",
	},
	428: {
		message: "Precondition Required",
		description:
			"The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.",
	},
	429: {
		message: "Too Many Requests",
		description:
			'The user has sent too many requests in a given amount of time ("rate limiting").',
	},
	431: {
		message: "Request Header Fields Too Large",
		description:
			"The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.",
	},
	451: {
		message: "Unavailable For Legal Reasons",
		description:
			"The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.",
	},
	500: {
		message: "Internal Server Error",
		description:
			"The server has encountered a situation it doesn't know how to handle.",
	},
	501: {
		message: "Not Implemented",
		description:
			"The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.",
	},
	502: {
		message: "Bad Gateway",
		description:
			"This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.",
	},
	503: {
		message: "Service Unavailable",
		description:
			"The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.",
	},
	504: {
		message: "Gateway Timeout",
		description:
			"This error response is given when the server is acting as a gateway and cannot get a response in time.",
	},
	505: {
		message: "HTTP Version Not Supported",
		description:
			"The HTTP version used in the request is not supported by the server.",
	},
	506: {
		message: "Variant Also Negotiates",
		description:
			"The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.",
	},
	507: {
		message: "Insufficient Storage",
		description:
			"The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.",
	},
	508: {
		message: "Loop Detected",
		description:
			"The server detected an infinite loop while processing the request.",
	},
	510: {
		message: "Not Extended",
		description:
			"Further extensions to the request are required for the server to fulfil it.",
	},
	511: {
		message: "Network Authentication Required",
		description:
			"The 511 status code indicates that the client needs to authenticate to gain network access.",
	},
};
