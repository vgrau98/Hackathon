package fr.laas.mooc.helper.om2m;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.eclipse.om2m.commons.constants.MimeMediaType;
import org.eclipse.om2m.commons.resource.Resource;
import org.eclipse.om2m.datamapping.jaxb.Mapper;

public class Serializer {
	
	/**
	 * Converts an OM2M resource Java object represnetitaion in its standard XML serialization.
	 * @param om2mResource
	 * @return the XML serialization of the resource
	 */
	public static String toXML(Resource om2mResource){
		Mapper m = new Mapper(MimeMediaType.XML);
		return m.objToString(om2mResource);
	}
	
	public static String toURL(String string){
		String result = "";
		try {
			result = URLEncoder.encode(string, "utf-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		return result;
	}
}
