package fr.laas.mooc.helper.om2m;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.om2m.commons.resource.AE;
import org.eclipse.om2m.commons.resource.Container;
import org.eclipse.om2m.commons.resource.ContentInstance;
import org.eclipse.om2m.commons.resource.SemanticDescriptor;

/**
 * This class should be instanciated using the {@link ClientFactory} class, provided with an 
 * appropriate configuration file. It provides high-level functions to be able to have a 
 * basic use of the OM2M REST API without having to go through the standard.
 */
public class ResourceCreator {
	private static final Logger LOGGER = LogManager.getLogger(ResourceCreator.class);
	
	/**
	 * Creates a {@link Container} resource representation.
	 * @param name
	 * @param parentId
	 * @return The representation of the created resource, null if the creation failed
	 */
	public static Container createContainer(String name) {
		Container cnt = new Container();
		cnt.setName(name);
		return cnt;
	}
	
	/**
	 * Creates a {@link ContentInstance} resource representation.
	 * @param name
	 * @param parentId
	 * @return The representation of the created resource, null if the creation failed
	 */
	public static ContentInstance createContentInstance(String content) {
		ContentInstance cin = new ContentInstance();
		cin.setContent(content);
		return cin;
	}
	
	/**
	 * Creates an {@link AE} resource representation.
	 * @param name
	 * @param parentId
	 * @return The representation of the created resource, null if the creation failed
	 */
	public static AE createAE(String name, String appId) {
		AE ae = new AE();
		ae.setRequestReachability(false);
		ae.setAppID(appId);
		ae.setName(name);
		return ae;
	}
	
	public static SemanticDescriptor createSemanticDescriptor(String name, String content){
		SemanticDescriptor smd = new SemanticDescriptor();
		smd.setName(name);
		smd.setDecodedDescriptor(content);
		smd.setDescriptorRepresentation("RDF/XML");
		return smd;
	}
}
