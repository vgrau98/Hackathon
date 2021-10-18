package fr.laas.mooc.helper.http;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

/**
 * This class represents an HTTP POST request
 */
public class HTTPPost extends HTTPRequest {
	private String body;
	private CloseableHttpClient httpclient;
	
	public HTTPPost(){
		this.httpclient = HttpClientBuilder.create()
				.disableAutomaticRetries()
				.build();
	}
	
	/**
	 * Sets the body to a raw string
	 * @param body
	 */
	public void setBody(String body){
		this.body = body;
	}
	
	/**
	 * The request is sent (the destinator MUST have been set).
	 * @return the HTTP status code
	 */
	public int send(){
		HttpPost httpPost = new HttpPost(this.destinator);
		System.out.println(this.destinator);
		for(Map<String, String> header : this.headers){
			for(String key : header.keySet()){
				httpPost.addHeader(key, header.get(key));
			}
		}
		CloseableHttpResponse response=null;
		try {
			httpPost.setEntity(new StringEntity(this.body));
			response = httpclient.execute(httpPost);
			//HttpEntity entity = response.getEntity();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	    finally {
	        try {
				response.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
	    }
	    return response.getStatusLine().getStatusCode();
	}
}
