package org.ujar.jh.petclinic.ngbdd.repository;

import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.ujar.jh.petclinic.ngbdd.domain.Authority;

/**
 * Spring Data R2DBC repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends R2dbcRepository<Authority, String> {}
