package fr.laas.mooc.helper.om2m;

import java.util.List;

import org.eclipse.om2m.commons.constants.MimeMediaType;
import org.eclipse.om2m.commons.resource.ResponsePrimitive;
import org.eclipse.om2m.commons.resource.URIList;
import org.eclipse.om2m.datamapping.jaxb.Mapper;

public class Deserializer {

	public static List<String> getUrisFromDiscoveryResponse(String response){
		Mapper mapper = new Mapper(MimeMediaType.XML);
		return ((URIList)mapper.stringToObj(response)).getListOfUri();
	}
}
