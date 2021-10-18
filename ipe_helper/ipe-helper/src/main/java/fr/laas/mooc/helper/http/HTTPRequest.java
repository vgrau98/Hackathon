package fr.laas.mooc.helper.http;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class gives a high-level HTTP requests representation. It is abstract, and shoul be implemented in the form of {@link HTTPPost}
 */
public abstract class HTTPRequest {
	protected List<Map<String, String>> headers;
	protected String destinator;
	protected Map<String, List<String>> queryStrings;
	
	public HTTPRequest(){
		this.headers = new ArrayList<>();
		this.queryStrings = new HashMap<>();
	}
	
	/**
	 * Adds a header to the request.
	 * @param name
	 * @param value
	 */
	public void addHeader(String name, String value){
		Map<String, String> newHeader = new HashMap<>();
		newHeader.put(name, value);
		this.headers.add(newHeader);
		System.out.println("Header added : "+this.headers.toString());
	}
	
	/**
	 * Sets the target to whom the request is going to be sent
	 * @param url
	 */
	public void setDestinator(String url){
		this.destinator = url;
	}
	
	/**
	 * Adds a querystring to the request
	 * @param name
	 * @param value
	 */
	public void addQueryString(String name, String value){
		if(!this.queryStrings.containsKey(name)){
			this.queryStrings.put(name, new ArrayList<>());
		}
		this.queryStrings.get(name).add(value);
	}
	
}
