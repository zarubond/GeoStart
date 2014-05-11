package com.zarubond.geostar;

import javax.jdo.annotations.Extension;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
/**
 * One player's shot
 * @author suvl
 *
 */
@PersistenceCapable
public class Shot {
    
    /**
     * To save write operations, pos_x, pos_y, dir_x, dir_y
     */
	@Persistent
	@Extension(vendorName="datanucleus", key="gae.unindexed", value="true")
	public float[] data=new float[4];
}
