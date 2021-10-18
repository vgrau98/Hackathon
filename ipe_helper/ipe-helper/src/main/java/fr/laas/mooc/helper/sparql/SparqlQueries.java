package fr.laas.mooc.helper.sparql;

import java.util.HashMap;
import java.util.Map;

import fr.irit.melodi.sparql.exceptions.IncompleteSubstitutionException;
import fr.irit.melodi.sparql.exceptions.NotAFolderException;
import fr.irit.melodi.sparql.files.FolderManager;
import fr.laas.mooc.helper.virtual.Platform;

public class SparqlQueries {
	private FolderManager queries;
	
	public SparqlQueries(){
		try {
			this.queries = new FolderManager("queries");
		} catch (NotAFolderException e) {
			e.printStackTrace();
		}
	}
	
	public String getSensorsQuery(){
		return this.queries.getQueries().get("get_sensors");
	}
	
	public String getPlatformSensorsQuery(Platform platform){
		Map<String, String> substitution = new HashMap<>();
		substitution.put("platform_id", platform.getName());
		try {
			return this.queries.getTemplateQueries().get("get_platform_sensors")
					.substitute(substitution);
		} catch (IncompleteSubstitutionException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public String getTemperatureSensorsQuery(){
		return this.queries.getQueries().get("get_temperature_sensors");
	}
}
