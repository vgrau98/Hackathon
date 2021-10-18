package fr.laas.mooc.helper.http;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;

/**
 * This class represents an HTTP POST request
 */
public class HTTPGet extends HTTPRequest {
	private CloseableHttpClient httpclient;
	
	public HTTPGet(){
		this.httpclient = HttpClientBuilder.create()
				.disableAutomaticRetries()
				.build();
	}
	
	/**
	 * The request is sent (the destinator MUST have been set).
	 * @return the HTTP response content
	 */
	public String send(){
		String qstring = "?";
		for(String queryKey : this.queryStrings.keySet()){
			for(String queryValue : this.queryStrings.get(queryKey)){
				qstring+=queryKey+"="+queryValue+"&";
			}
		}
		String target = this.destinator;
		if(!qstring.equals("?")){
			target+=qstring;
		}
		HttpGet httpGet = new HttpGet(target);
		for(Map<String, String> header : this.headers){
			for(String key : header.keySet()){
				httpGet.addHeader(key, header.get(key));
			}
		}
		
		CloseableHttpResponse response=null;
		HttpEntity entity =null;
		String responseContent = null;
		try {
			response = httpclient.execute(httpGet);
			entity = response.getEntity();
			responseContent = convertStreamToString(entity.getContent());
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
		if(entity == null){
			return response.getStatusLine().getReasonPhrase();
		} else {
			return responseContent;
		}
	}
	
	public static String convertStreamToString(InputStream is) {
		BufferedReader br = null;
		StringBuilder sb = new StringBuilder();
		String line;
		try {
			br = new BufferedReader(new InputStreamReader(is));
			while ((line = br.readLine()) != null) {
				sb.append(line);
				sb.append("\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (br != null) {
				try {
					br.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		return sb.toString();
	}
}
