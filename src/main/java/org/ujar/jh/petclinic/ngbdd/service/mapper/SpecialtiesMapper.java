package org.ujar.jh.petclinic.ngbdd.service.mapper;

import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;
import org.ujar.jh.petclinic.ngbdd.domain.Specialties;
import org.ujar.jh.petclinic.ngbdd.domain.Vets;
import org.ujar.jh.petclinic.ngbdd.service.dto.SpecialtiesDTO;
import org.ujar.jh.petclinic.ngbdd.service.dto.VetsDTO;

/**
 * Mapper for the entity {@link Specialties} and its DTO {@link SpecialtiesDTO}.
 */
@Mapper(componentModel = "spring")
public interface SpecialtiesMapper extends EntityMapper<SpecialtiesDTO, Specialties> {
    @Mapping(target = "vets", source = "vets", qualifiedByName = "vetsIdSet")
    SpecialtiesDTO toDto(Specialties s);

    @Mapping(target = "removeVet", ignore = true)
    Specialties toEntity(SpecialtiesDTO specialtiesDTO);

    @Named("vetsId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    VetsDTO toDtoVetsId(Vets vets);

    @Named("vetsIdSet")
    default Set<VetsDTO> toDtoVetsIdSet(Set<Vets> vets) {
        return vets.stream().map(this::toDtoVetsId).collect(Collectors.toSet());
    }
}
