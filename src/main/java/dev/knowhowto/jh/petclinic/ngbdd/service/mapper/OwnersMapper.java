package dev.knowhowto.jh.petclinic.ngbdd.service.mapper;

import org.mapstruct.*;
import dev.knowhowto.jh.petclinic.ngbdd.domain.Owners;
import dev.knowhowto.jh.petclinic.ngbdd.service.dto.OwnersDTO;

/**
 * Mapper for the entity {@link Owners} and its DTO {@link OwnersDTO}.
 */
@Mapper(componentModel = "spring")
public interface OwnersMapper extends EntityMapper<OwnersDTO, Owners> {}
